"""
Minimal dependency-free XLSX writer.

Written because openpyxl/xlsxwriter are unavailable in this environment and the
package index is blocked by egress policy. Produces a standards-compliant
SpreadsheetML workbook using only the standard library.

Supports: multiple worksheets, inline strings, numbers, a small style palette,
column widths, frozen panes and autofilter.
"""

import zipfile
from xml.sax.saxutils import escape

# Style ids exposed to callers
S_DEFAULT = 0
S_HEADER = 1
S_TITLE = 2
S_BOLD = 3
S_MONEY = 4
S_NOTE = 5
S_SUB = 6
S_WRAP = 7

_ILLEGAL = dict.fromkeys(range(0x20))
for _k in (0x09, 0x0A, 0x0D):
    _ILLEGAL.pop(_k, None)


def col_letter(n):
    """1-based column index -> spreadsheet column letters."""
    s = ""
    while n > 0:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def _clean(text):
    return str(text).translate(_ILLEGAL)


class Cell:
    __slots__ = ("value", "style")

    def __init__(self, value, style=S_DEFAULT):
        self.value = value
        self.style = style


class Sheet:
    def __init__(self, name, widths=None, freeze=None, autofilter=None):
        # Excel sheet names: max 31 chars, no  : \ / ? * [ ]
        self.name = str(name)[:31]
        self.rows = []
        self.widths = widths or []
        self.freeze = freeze          # (rows_frozen, cols_frozen)
        self.autofilter = autofilter  # (first_row, first_col, last_row, last_col) 1-based

    def add(self, cells):
        self.rows.append(list(cells))

    def blank(self, n=1):
        for _ in range(n):
            self.rows.append([])


def _cell_xml(ref, cell):
    style = cell.style
    v = cell.value
    if v is None or v == "":
        if style == S_DEFAULT:
            return ""
        return '<c r="%s" s="%d"/>' % (ref, style)
    if isinstance(v, bool):
        return '<c r="%s" s="%d" t="b"><v>%d</v></c>' % (ref, style, 1 if v else 0)
    if isinstance(v, (int, float)):
        return '<c r="%s" s="%d"><v>%s</v></c>' % (ref, style, repr(v) if isinstance(v, float) else v)
    return '<c r="%s" s="%d" t="inlineStr"><is><t xml:space="preserve">%s</t></is></c>' % (
        ref, style, escape(_clean(v)))


def _sheet_xml(sheet):
    out = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
           '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">']

    max_cols = max([len(r) for r in sheet.rows] + [1])
    out.append('<dimension ref="A1:%s%d"/>' % (col_letter(max_cols), max(len(sheet.rows), 1)))

    out.append('<sheetViews><sheetView workbookViewId="0">')
    if sheet.freeze:
        fr, fc = sheet.freeze
        top_left = "%s%d" % (col_letter(fc + 1), fr + 1)
        parts = []
        if fc:
            parts.append('xSplit="%d"' % fc)
        if fr:
            parts.append('ySplit="%d"' % fr)
        out.append('<pane %s topLeftCell="%s" activePane="bottomRight" state="frozen"/>'
                   % (" ".join(parts), top_left))
    out.append('</sheetView></sheetViews>')
    out.append('<sheetFormatPr defaultRowHeight="14.5"/>')

    if sheet.widths:
        out.append('<cols>')
        for i, w in enumerate(sheet.widths, start=1):
            out.append('<col min="%d" max="%d" width="%s" customWidth="1"/>' % (i, i, w))
        out.append('</cols>')

    out.append('<sheetData>')
    for ridx, row in enumerate(sheet.rows, start=1):
        if not row:
            out.append('<row r="%d"/>' % ridx)
            continue
        cells = []
        for cidx, cell in enumerate(row, start=1):
            if not isinstance(cell, Cell):
                cell = Cell(cell)
            xml = _cell_xml("%s%d" % (col_letter(cidx), ridx), cell)
            if xml:
                cells.append(xml)
        out.append('<row r="%d">%s</row>' % (ridx, "".join(cells)))
    out.append('</sheetData>')

    if sheet.autofilter:
        r1, c1, r2, c2 = sheet.autofilter
        out.append('<autoFilter ref="%s%d:%s%d"/>' % (col_letter(c1), r1, col_letter(c2), r2))

    out.append('</worksheet>')
    return "".join(out)


_STYLES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0.00"/></numFmts>
<fonts count="6">
<font><sz val="10"/><name val="Calibri"/></font>
<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
<font><b/><sz val="14"/><color rgb="FF1F3864"/><name val="Calibri"/></font>
<font><b/><sz val="10"/><name val="Calibri"/></font>
<font><i/><sz val="9"/><color rgb="FF7F7F7F"/><name val="Calibri"/></font>
<font><b/><sz val="10"/><color rgb="FF1F3864"/><name val="Calibri"/></font>
</fonts>
<fills count="4">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF1F3864"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFDDEBF7"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color rgb="FFBFBFBF"/></left><right style="thin"><color rgb="FFBFBFBF"/></right><top style="thin"><color rgb="FFBFBFBF"/></top><bottom style="thin"><color rgb="FFBFBFBF"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="8">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top"/></xf>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top"/></xf>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf>
<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="5" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
</cellXfs>
</styleSheet>'''


def write_workbook(path, sheets, title="Workbook", creator="KS Pierre"):
    n = len(sheets)
    ct = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
          '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
          '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
          '<Default Extension="xml" ContentType="application/xml"/>',
          '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
          '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
          '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
          '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>']
    for i in range(1, n + 1):
        ct.append('<Override PartName="/xl/worksheets/sheet%d.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' % i)
    ct.append('</Types>')

    root_rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                 '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
                 '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
                 '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
                 '</Relationships>')

    wb = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
          '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
          'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>']
    for i, sh in enumerate(sheets, start=1):
        wb.append('<sheet name="%s" sheetId="%d" r:id="rId%d"/>' % (escape(sh.name), i, i))
    wb.append('</sheets></workbook>')

    wb_rels = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
               '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">']
    for i in range(1, n + 1):
        wb_rels.append('<Relationship Id="rId%d" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet%d.xml"/>' % (i, i))
    wb_rels.append('<Relationship Id="rId%d" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' % (n + 1))
    wb_rels.append('</Relationships>')

    core = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
            'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" '
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
            '<dc:title>%s</dc:title><dc:creator>%s</dc:creator><cp:lastModifiedBy>%s</cp:lastModifiedBy>'
            '</cp:coreProperties>') % (escape(title), escape(creator), escape(creator))

    app = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
           '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
           'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
           '<Application>Microsoft Excel</Application><Company>%s</Company></Properties>') % escape(creator)

    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", "".join(ct))
        z.writestr("_rels/.rels", root_rels)
        z.writestr("docProps/core.xml", core)
        z.writestr("docProps/app.xml", app)
        z.writestr("xl/workbook.xml", "".join(wb))
        z.writestr("xl/_rels/workbook.xml.rels", "".join(wb_rels))
        z.writestr("xl/styles.xml", _STYLES)
        for i, sh in enumerate(sheets, start=1):
            z.writestr("xl/worksheets/sheet%d.xml" % i, _sheet_xml(sh))
    return path

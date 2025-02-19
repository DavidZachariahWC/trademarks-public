import xml.sax
import xml.sax.saxutils
import os

class CaseFileHandler(xml.sax.ContentHandler):
    def __init__(self, output_file):
        self.output_file = open(output_file, 'w', encoding='utf-8')
        self.status_codes_to_remove = set(str(code) for code in (
            list(range(400, 418)) + list(range(600, 611)) + list(range(612, 615)) +
            [618, 626, 632] + list(range(709, 715)) + [781, 782, 900, 901, 968]
        ))
        self.international_status_codes_to_remove = {'100', '101', '102'}
        self.in_case_file = False
        self.skip_current_case_file = False
        self.current_element = ''
        self.status_code = ''
        self.international_status_code = ''
        self.buffer = ''
        self.element_stack = []

    def startDocument(self):
        self.output_file.write('<?xml version="1.0" encoding="utf-8"?>\n')

    def endDocument(self):
        self.output_file.close()

    def startElement(self, name, attrs):
        self.element_stack.append(name)
        self.current_element = name

        # Build the start tag with attributes, escaping necessary characters
        start_tag = f'<{name}'
        for attr_name in attrs.getNames():
            attr_value = attrs.getValue(attr_name)
            escaped_value = xml.sax.saxutils.escape(attr_value, {'"': '&quot;', "'": '&apos;'})
            start_tag += f' {attr_name}="{escaped_value}"'
        start_tag += '>'

        if name == 'case-file':
            self.in_case_file = True
            self.skip_current_case_file = False
            self.status_code = ''
            self.international_status_code = ''
            self.buffer = start_tag
        elif self.in_case_file:
            self.buffer += start_tag
        else:
            self.output_file.write(start_tag)

    def endElement(self, name):
        end_tag = f'</{name}>'

        if name == 'case-file':
            # Decide whether to write the case-file to the output
            if not self.skip_current_case_file:
                self.buffer += end_tag
                self.output_file.write(self.buffer)
            self.in_case_file = False
            self.skip_current_case_file = False
            self.buffer = ''
        elif self.in_case_file:
            self.buffer += end_tag
        else:
            self.output_file.write(end_tag)
        self.element_stack.pop()

        self.current_element = self.element_stack[-1] if self.element_stack else ''

    def characters(self, content):
        if self.in_case_file:
            # Process content for status codes before escaping
            if self.current_element == 'status-code':
                self.status_code += content.strip()
                if self.status_code in self.status_codes_to_remove:
                    self.skip_current_case_file = True
            elif self.current_element == 'international-status-code':
                self.international_status_code += content.strip()
                if self.international_status_code in self.international_status_codes_to_remove:
                    self.skip_current_case_file = True
            # Escape content before adding to buffer
            escaped_content = xml.sax.saxutils.escape(content)
            self.buffer += escaped_content
        else:
            # Escape content before writing to output
            escaped_content = xml.sax.saxutils.escape(content)
            self.output_file.write(escaped_content)

def remove_case_files(input_file, output_file):
    parser = xml.sax.make_parser()
    handler = CaseFileHandler(output_file)
    parser.setContentHandler(handler)
    parser.parse(input_file)

if __name__ == '__main__':
    input_xml_file = '/Users/davidzachariah/downloads/apc18840407-20231231-33.xml'
    output_xml_file = '/Users/davidzachariah/Desktop/apc18840407-20231231-33_cleaned.xml'
    remove_case_files(input_xml_file, output_xml_file)
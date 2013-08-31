"""Just for fun, a script that updates the <title> tag of each exercise .html
file with its display name.
"""

import codecs
import errno
import os

import requests


def get_title_dict():
    r = requests.get("http://www.khanacademy.org/api/v1/exercises")
    data = r.json()
    return {e['file_name']: e['pretty_display_name']
            for e in data if e['file_name']}


def fix_title(filename, title):
    print filename
    full_filename = os.path.join('exercises', filename)

    lines = []
    title_lines = 0

    try:
        with codecs.open(full_filename, 'r', encoding='utf-8') as f:
            for line in f.readlines():
                if '<title>' in line:
                    line = u"%s<title>%s</title>\n" % (
                            line.split('<title>', 1)[0], title)
                    title_lines += 1
                lines.append(line)
    except IOError, e:
        # If the file's missing, the exercise probably isn't live, so skip it.
        if e.errno == errno.ENOENT:
            return
        else:
            raise

    assert title_lines == 1

    with codecs.open(full_filename, 'w', encoding='utf-8') as f:
        f.write(''.join(lines))


if __name__ == '__main__':
    title_dict = get_title_dict()
    for filename, title in sorted(title_dict.items()):
        fix_title(filename, title)

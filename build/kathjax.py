import os
import shutil
import sys
import tempfile
import re

try:
    import json
except ImportError:
    import simplejson as json

pack = [
    'extensions/MathZoom.js',
    'extensions/TeX/AMSmath.js',
    'extensions/TeX/AMSsymbols.js',
    'extensions/TeX/noErrors.js',
    'extensions/TeX/noUndefined.js',
    'extensions/tex2jax.js',
    'jax/element/mml/jax.js',
    'jax/input/TeX/config.js',
    'jax/input/TeX/jax.js',
    'jax/output/HTML-CSS/config.js',
    'jax/output/HTML-CSS/jax.js',
]

origwd = os.getcwd()
tempdir = tempfile.mkdtemp()
mjdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../utils/MathJax"))

if os.path.isdir(mjdir):
    print "Directory %s exists, exiting" % mjdir
    sys.exit(1)
else:
    print "Creating directory %s" % mjdir
    os.mkdir(mjdir)

os.chdir(tempdir)

print "Downloading MathJax..."
os.system('curl -# -L -o mathjax.zip https://github.com/mathjax/MathJax/zipball/v1.1a')

print "Unzipping..."
os.system('unzip -q mathjax.zip')
os.unlink('mathjax.zip')

try:
    os.chdir((path for path in os.listdir(".") if path.startswith("mathjax-")).next())
except:
    print "Error unzipping mathjax.js"
    sys.exit(1)

# Pack most things into KAthJax.js

print "Joining files and copying fonts..."

os.mkdir(os.path.join(mjdir, 'config'))
kathjax_js = open(os.path.join(mjdir, 'config/KAthJax.js'), 'w')

kathjax_js.write('MathJax.Ajax.Preloading(\n')
kathjax_js.write(',\n'.join('\t%s' % json.dumps('[MathJax]/%s' % path) for path in pack))
kathjax_js.write('\n);\n\n')
kathjax_js.write('MathJax.Hub.Config({"v1.0-compatible":false});\n\n')

r_comment = re.compile(r'^/\*.+?\*/\s*', re.DOTALL)
for path in pack:
    fi = open(path, 'r')
    contents = fi.read()
    fi.close()

    kathjax_js.write(r_comment.sub('', contents.strip(), 1))
    kathjax_js.write('\n\n')

kathjax_js.write('MathJax.Ajax.loadComplete("[MathJax]/config/KAthJax.js");\n')
kathjax_js.close()

# Copy some other things

dirs = [
    'fonts/HTML-CSS/TeX/eot',
    'fonts/HTML-CSS/TeX/otf',
    'fonts/HTML-CSS/TeX/svg',
    'jax/output/HTML-CSS/autoload', # not sure what this is
    'jax/output/HTML-CSS/fonts/TeX', # not sure if we need this either; better safe than sorry?
]

for d in dirs:
    dest = os.path.join(mjdir, d)

    # Make sure parent directory exists
    if not os.path.exists(os.path.dirname(dest)):
        os.makedirs(os.path.dirname(dest))

    shutil.copytree(d, dest)

shutil.copy('MathJax.js', mjdir)

print "Removing temporary directory..."
os.chdir(origwd)
shutil.rmtree(tempdir)

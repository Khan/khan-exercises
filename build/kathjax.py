import hashlib
import os
import re
import shutil
import sys
import tempfile

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
    'extensions/TeX/newcommand.js',
    'extensions/TeX/boldsymbol.js',
    'extensions/tex2jax.js',
    'jax/element/mml/jax.js',
    'jax/input/TeX/config.js',
    'jax/input/TeX/jax.js',
    'jax/output/HTML-CSS/config.js',
    'jax/output/HTML-CSS/jax.js',
]

origwd = os.getcwd()
tempdir = tempfile.mkdtemp()
mjdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../utils/MathJax/1.1a"))

if os.path.isdir(mjdir):
    print "%s exists, exiting" % mjdir
    sys.exit(1)
else:
    print "Creating directory %s" % mjdir
    os.makedirs(mjdir)

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

print "Joining JavaScript files..."

kathjax_js = open('KAthJax.js', 'w')

config_js = open(os.path.join(origwd, os.path.dirname(__file__), "kathjax-config.js"), 'r')
kathjax_js.write(config_js.read())
config_js.close()

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

kathjax_js.write('(function( ajax ) {\n')
kathjax_js.write('\tfor (var path in ajax.loading) {\n')
kathjax_js.write('\t\tif ( ( /KAthJax-[0-9a-f]{32}.js$/ ).test( path ) ) {\n')
kathjax_js.write('\t\t\tajax.loadComplete( path );\n')
kathjax_js.write('\t\t}\n')
kathjax_js.write('\t}\n')
kathjax_js.write('})( MathJax.Ajax );\n')
kathjax_js.close()

# Pack KAthJax.js and copy to mjdir

os.mkdir(os.path.join(mjdir, 'config'))
os.system('uglifyjs --overwrite --ascii KAthJax.js')

kathjax_js = open('KAthJax.js', 'r')
md5 = hashlib.md5(kathjax_js.read()).hexdigest()
kathjax_js.close()

kathjax_basename = "KAthJax-%s" % md5
shutil.copy('KAthJax.js', os.path.join(mjdir, 'config/%s.js' % kathjax_basename))

# Update hash in khan-exercise.js

khan_exercise_path = os.path.join(origwd, os.path.dirname(__file__), "../khan-exercise.js")

khan_exercise_f = open(khan_exercise_path, 'r')
khan_exercise = khan_exercise_f.read()
khan_exercise_f.close()

khan_exercise_f = open(khan_exercise_path, 'w')
khan_exercise_f.write(re.sub(r'KAthJax-[0-9a-f]{32}', kathjax_basename, khan_exercise))
khan_exercise_f.close()

print "Generated %s.js, copying files..." % kathjax_basename

# Copy some other things

dirs = [
    'fonts/HTML-CSS/TeX/eot',
    'fonts/HTML-CSS/TeX/otf',
    'fonts/HTML-CSS/TeX/svg',
    'jax/output/HTML-CSS/autoload', # not sure what this is
    'jax/output/HTML-CSS/fonts/TeX', # not sure if we need this either; better safe than sorry?
    'jax/element/mml/optable', # seems like we need this too
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

print "Done. You probably want to run:"
print "  git add -A utils/MathJax"
print "to remove deleted files from git."

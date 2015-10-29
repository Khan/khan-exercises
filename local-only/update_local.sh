#!/bin/sh -e

# Updates a specific set of files from the webapp repo, that are needed
# for khan-exercises 'local' mode.  See the README for more details.
#
# I also take the opportunity to update khan-site.css, which isn't
# a direct copy but is able to be munged automatically.
#
# If an argument is specified, it is taken as the root of the webapp
# repo.  Otherwise, the parent of khan-exercises is used as the root.

exercises_root="$PWD"
while [ "$exercises_root" != "/" ]; do
    [ `basename "$exercises_root"` = khan-exercises ] && break
    exercises_root=`dirname "$exercises_root"`
done
if [ -z "$exercises_root" ]; then
    echo "FATAL ERROR: cannot find 'khan-exercises' above $PWD."
    echo "Try running this script from a different directory."
    exit 1
fi

webapp_root="$1"
if [ -z "$webapp_root" ]; then
    webapp_root=`dirname "$exercises_root"`   # directory above khan-exercises
    if [ ! -s "$webapp_root/app.yaml" ]; then
        echo "FATAL ERROR: cannot find webapp-root above $exercises_root."
        echo "Try running this script like so: $0 <location-of-webapp-root>"
        exit 2
    fi
fi

srcdir="$webapp_root/third_party/javascript-khansrc"
destdir="$exercises_root/local-only"

# Copy stuff from the webapp repo into local-only.
cp -f "$srcdir"/jquery-migrate/jquery-migrate-1.1.1.js "$destdir"
cp -f "$srcdir"/jquery/jquery.js "$destdir"
cp -f "$srcdir"/qTip2/jquery.qtip.js "$destdir"
cp -f "$srcdir"/underscore/underscore.js "$destdir"
cp -f "$srcdir"/moment-khansrc/moment.js "$destdir"

# Get an es5-friendly version of i18n.js
(
   cd "$webapp_root"
   python kake/build_prod_main.py genfiles/compiled_es6/en/javascript/shared-package/i18n.js
)

# Get rid of the require lines -- we just provide all the required
# libs as globals.  Also get rid of module.exports, which this js
# system doesn't like.  We also need to wrap this in an IIFE to avoid
# leaking internal vars.
( echo "(function() {"
  echo "// Perseus running in local mode depends on \$_, which is defined here"
  echo "if (typeof React !== 'undefined') {"
  echo "    var createFragment = React.__internalAddons.createFragment;"
  echo "}\n"
  sed /module.exports/q "$webapp_root"/genfiles/compiled_es6/en/javascript/shared-package/i18n.js | grep -v -e '= require("' -e 'module.exports ='
  echo "})();"
) > "$destdir"/i18n.js

# We only need some of the jquery-ui files, and we'll concatenate them together
rm -f "$destdir"/jquery-ui.js
for f in core widget mouse position effect \
    effect-shake button draggable resizable dialog; do
   cat "$srcdir"/jqueryui/jquery.ui.$f.js >>"$destdir"/jquery-ui.js
done

# We copy all the icu files, so we can support 'commafy' in all locales.
mkdir -p "$destdir/localeplanet"
cp -f "$webapp_root"/third_party/javascript-khansrc/localeplanet/icu.* \
    "$destdir/localeplanet"

# Remove the __language__ symlink
rm -f "$destdir/localeplanet/icu.__language__.js"

# Update khan-site.css
python "$webapp_root/kake/build_prod_main.py" shared.css exercises.css \
   --readable

cat "$webapp_root/genfiles/readable_css_packages_prod/en/shared-package.css" \
    "$webapp_root/genfiles/readable_css_packages_prod/en/exercises-package.css" \
    | sed 's|url(/*\(.*images.*\))|url(http://www.khanacademy.org/\1)|' \
    > "$exercises_root/css/khan-site.css"

cat "$exercises_root/css/khan-exercise-dev.css" \
    >> "$exercises_root/css/khan-site.css"

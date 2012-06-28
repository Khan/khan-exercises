#!/bin/bash

PACKAGES="shared exercises"

BASE_DIR=".."
DEV_CSS="css/khan-exercise-dev.css"
OUTPUT="css/khan-site.css"

for package in ${PACKAGES}; do
    if [ ! -f ${BASE_DIR}/stylesheets/${package}-package/combined.css ]; then
        echo "${BASE_DIR}/stylesheets/${package}-package/combined.css not found!"
        echo "You should run the deploy script (with --dryrun)"
        echo
        exit 66
    fi
done

echo > ${OUTPUT}

for package in ${PACKAGES}; do
    echo ${package}
    sed 's|url(\(.*images.*\))|url(http://www.khanacademy.org/\1)|' ${BASE_DIR}/stylesheets/${package}-package/combined.css >> ${OUTPUT}
done

cat ${DEV_CSS} >> ${OUTPUT}

echo

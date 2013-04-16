#!/bin/bash

PACKAGES="shared.css exercises.css"

BASE_DIR=".."
DEV_CSS="css/khan-exercise-dev.css"
OUTPUT="css/khan-site.css"

python ${BASE_DIR}/deploy/combine.py ${PACKAGES} | sed 's|url(/*\(.*images.*\))|url(http://www.khanacademy.org/\1)|' > ${OUTPUT}
cat ${DEV_CSS} >> ${OUTPUT}

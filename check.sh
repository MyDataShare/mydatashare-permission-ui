#!/usr/bin/env bash

CUR_DIR=`pwd`
TOP_DIR=`dirname $0`
cd $TOP_DIR

printf "\n===============[ prettier ]===============\n"
prettier --check src
prettier_rc=$?

printf "\n===============[ npm audit ]===============\n"
(set -o pipefail; npm audit --audit-level=critical --production | perl -pe 's/\e\[?.*?[\@-~]//g' | sed 's/^ *$//' | sed '/^. \(Low\|Moderate\|High\|Critical\) /,/^. More info /{ /^[ \t]*$/d}' | sed '/^. Low /,/^. More info /d' | cat -s)
audit_rc=$?

printf "\n===============[ retire ]===============\n"
retire --severity high --path src
retire_rc=$?

cd $CUR_DIR

if [ "$audit_rc" -ne 0 ] || \
   [ "$retire_rc" -ne 0 ] || \
   [ "$prettier_rc" -ne 0 ] ; then
  exit 1
fi

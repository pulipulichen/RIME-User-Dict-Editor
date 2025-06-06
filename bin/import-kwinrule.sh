#!/bin/bash

cd `dirname "$0"`

APPLICATION="RIME-User-Dict-Editor"

# Define the path to the kwin rule file
KWIN_RULE_FILE="./$APPLICATION.kwinrule"

# Import the kwin rule
kwin_rules_manager --import "$KWIN_RULE_FILE"

echo "KWin rule for $APPLICATION imported successfully."

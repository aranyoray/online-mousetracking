#!/bin/bash

rm -rf psiturk/static/data/condition_list_*
rm -rf output.csv
git checkout psiturk/static/data/
git checkout psiturk/participants.db
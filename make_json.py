#!/usr/bin/python

import yaml
import json
import sys


try:
 n = sys.argv[1]
 f = open(n)
 d = yaml.load(f.read())
 o = open(n.replace('yml','json'),'w')
 o.write(json.dumps(d))
 o.close()
 exit()
except:
 print '------ usage -------'
 print '\t make_json.py input_file_path.yml'
 print '\t outputs imput_file_path.json'

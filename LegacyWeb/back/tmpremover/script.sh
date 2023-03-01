#!/bin/sh
#Elimina todos los archivos temporales con más de 5 días de antiguedad
find /tmp/legacy -type f -mtime +5 -exec rm -f {} \;
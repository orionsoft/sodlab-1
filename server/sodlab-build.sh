rm -rf build
rm sodlab-server.zip
orion build --output build
cp -R -f -pX .ebextensions/ build/.ebextensions/
cp -R -f -pX .elasticbeanstalk/ build/.elasticbeanstalk/
cd build
zip -q ../sodlab-server.zip -r * .[^.]*
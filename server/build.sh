set -e

echo $BUILD_DIR

orion build --output "$BUILD_DIR/build"

cp -pR $APP_DIR/.ebextensions $BUILD_DIR/build/.ebextensions

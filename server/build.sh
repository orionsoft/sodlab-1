set -e

orion build --output "$BUILD_DIR/build"

cp -pR $APP_DIR/.ebextensions $BUILD_DIR/build/.ebextensions

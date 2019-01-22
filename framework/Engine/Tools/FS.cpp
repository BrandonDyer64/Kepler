
#include "FS.h"
#include <fstream>
#include <streambuf>
#include <sstream>

namespace Kepler::FS {

std::string ReadFile(const std::string &filename) {
  std::ifstream t("data/" + filename);
  std::stringstream buffer;
  buffer << t.rdbuf();
  return buffer.str();
}

} // namespace Kepler

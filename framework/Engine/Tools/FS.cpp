
#include "FS.h"
#include <fstream>
#include <string>
#include <streambuf>
#include <sstream>

namespace Kepler::FS {

std::string ReadFile(const std::string &filename) {
  std::ifstream t("data/" + filename);
  std::stringstream buffer;
  buffer << t.rdbuf();
  return buffer.str();
}

std::vector<std::string> ReadFile(const std::string &filename, char delim) {
  std::ifstream file("data/" + filename);
  if (!file.is_open()) {
    std::cout << "Failed to open file: " << filename << std::endl;
  }
  std::vector<std::string> out;
  std::string line;
  while (std::getline(file, line, delim)) {
    out.push_back(line);
  }
  return out;
}

} // namespace Kepler

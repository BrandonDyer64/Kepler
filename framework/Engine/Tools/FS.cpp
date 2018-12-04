
#include "FS.h"
#include <fstream>

namespace Kepler {

std::vector<char> ReadFile(const std::string &filename) {
  std::cout << "Load file: " << filename << std::endl;
  std::ifstream file(filename, std::ios::ate | std::ios::binary);

  if (!file.is_open()) {
    throw std::runtime_error("failed to open file!");
  }

  size_t fileSize = (size_t)file.tellg();
  std::vector<char> buffer(fileSize);

  file.seekg(0);
  file.read(buffer.data(), fileSize);

  file.close();

  return buffer;
}

} // namespace Kepler

#ifndef ReadFile_h
#define ReadFile_h

#include <iostream>
#include <string>
#include <vector>

namespace Kepler::FS {

std::string ReadFile(const std::string &filename);

std::vector<std::string> ReadFile(const std::string &filename, char delim);

} // namespace Kepler

#endif

#include <string>
#include <vector>
#include <sstream>
#include <iterator>

namespace Kepler {

template<typename Out>
void SplitString(const std::string &s, char delim, Out result) {
  std::stringstream ss(s);
  std::string item;
  while (std::getline(ss, item, delim)) {
    *(result++) = item;
  }
}

std::vector<std::string> SplitString(const std::string &s, char delim) {
  std::vector<std::string> elems;
  SplitString(s, delim, std::back_inserter(elems));
  return elems;
}

}

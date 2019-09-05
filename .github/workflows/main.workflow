workflow "Main" {
  on = "push"
  resolves = ["Build"]
}

action "Build" {
  uses = "icepuma/rust-action@master"
  args = "cargo fmt -- --check && cargo clippy -- -Dwarnings && cargo test"
}

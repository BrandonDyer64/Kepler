workflow "Quickstart" {
  on = "push"
  resolves = ["Quickstart"]
}

action "Quickstart" {
  uses = "icepuma/rust-action@master"
  args = "cargo fmt -- --check && cargo clippy -- -Dwarnings && cargo test"
}

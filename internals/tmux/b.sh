#!/bin/bash

# Kill session if exists
tmux has-session -t prfs_a 2>/dev/null
if [ $? -eq 0 ]; then
  tmux kill-session -t prfs_a
fi

# Set up panes
tmux new-session -d -s prfs_a
tmux split-window -v -t prfs_a
tmux split-window -v -t prfs_a
tmux select-pane -t 1
tmux split-window -v -t prfs_a
tmux split-window -v -t prfs_a

# Prfs api server
tmux select-pane -t prfs_a:1.1
tmux send-keys "./ci dev_prfs_api_server" ENTER

# Prfs asset server
tmux select-pane -t prfs_a:1.2
tmux send-keys "./ci dev_prfs_asset_server" ENTER

# Prfs embed webapp
tmux select-pane -t prfs_a:1.3
tmux send-keys "./ci dev_prfs_proof_webapp" ENTER

# Prfs id webapp
tmux select-pane -t prfs_a:1.4
tmux send-keys "./ci dev_prfs_id_webapp" ENTER

# Prfs proof webapp
tmux select-pane -t prfs_a:1.5
tmux send-keys "./ci dev_shy_webapp" ENTER

tmux attach -t prfs_a

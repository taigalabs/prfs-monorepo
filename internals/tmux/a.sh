#!/bin/bash

# Kill session if exists
tmux has-session -t prfs_a 2>/dev/null
if [ $? -eq 0 ]; then
  tmux kill-session -t prfs_a
fi

# setting panes
tmux new-session -d -s prfs_a
tmux split-window -v -t prfs_a
tmux split-window -v -t prfs_a
tmux select-pane -t 1
tmux split-window -v -t prfs_a

# api server
tmux select-pane -t prfs_a:1.1
tmux send-keys "./ci dev_api_server" ENTER

# # asset server
tmux select-pane -t prfs_a:1.2
tmux send-keys "./ci dev_asset_server" ENTER

# # asset server
tmux select-pane -t prfs_a:1.3
tmux send-keys "./ci dev_sdk_web_module" ENTER

# # webapp proof
tmux select-pane -t prfs_a:1.4
tmux send-keys "./ci dev_webapp_proof" ENTER

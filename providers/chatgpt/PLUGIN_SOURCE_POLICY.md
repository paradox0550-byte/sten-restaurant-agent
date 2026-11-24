# ChatGPT plugin source policy

The canonical source for the installed STEN AI ChatGPT plugin is providers/chatgpt/plugin-source/ in this repository.

Do not edit the installed Plugin Creator copy directly. Edit this repository, pass CI, build dist/sten-ai-chatgpt-plugin.tar.gz, inspect the archive, then update the existing plugin from that archive. Keep the plugin's current identity and private audience during ordinary updates.

The installed plugin is a deployment artifact. It is not a source repository and must never be used as the starting point for new content changes. Any emergency edit made directly in Plugin Creator must be immediately exported and reconciled back into this repository before another release.

The build writes SOURCE_REVISION.txt into the package so the deployed artifact can be traced to a repository commit.
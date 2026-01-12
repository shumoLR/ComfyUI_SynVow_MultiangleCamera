"""
ComfyUI-SynvowMultiangle: A 3D camera angle control node for ComfyUI
Outputs camera angle prompts for multi-angle image generation
"""

import os
import nodes

# Register the js directory for web extensions
custom_node_dir = os.path.dirname(os.path.realpath(__file__))
js_dir = os.path.join(custom_node_dir, "js")
nodes.EXTENSION_WEB_DIRS["ComfyUI-SynvowMultiangle"] = js_dir

from .Multiangle_Camera import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]

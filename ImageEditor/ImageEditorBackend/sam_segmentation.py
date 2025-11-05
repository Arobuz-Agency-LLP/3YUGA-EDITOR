import logging
from typing import Optional

import numpy as np
from PIL import Image
from rembg import remove

logger = logging.getLogger(__name__)


def remove_background_mask(image: Image.Image, get_session, model: str = 'isnet-general-use') -> Optional[np.ndarray]:
    """Return a binary mask (uint8 0/255) of the foreground using rembg model.

    model can be 'isnet-general-use', 'u2net', 'u2net_human_seg', or 'sam'.
    Returns None if extraction fails.
    """
    try:
        session = get_session(model)
        output = remove(image, session=session)

        # Extract alpha channel as mask
        if output.mode == 'RGBA':
            alpha = np.array(output.split()[-1])
        else:
            alpha = np.array(output.convert('L'))

        # Binarize
        mask = (alpha > 127).astype(np.uint8) * 255
        return mask
    except Exception as e:
        logger.warning(f'Foreground mask extraction failed (model={model}): {e}')
        return None


def get_sam_mask(image: Image.Image, get_session) -> Optional[np.ndarray]:
    """Try to get a mask using the SAM model via rembg. Returns None if it fails."""
    return remove_background_mask(image, get_session, model='sam')











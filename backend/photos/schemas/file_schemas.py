from dataclasses import dataclass
from enum import Enum
from typing import List, Optional


class StyleColumnChoices(Enum):
    ONE_COLUMN = 0, "one column"
    TWO_COLUMNS = 1, "two columns"
    THREE_COLUMNS = 2, "three columns"


class StyleSizeChoices(Enum):
    FULL_HEIGHT = 0, "full height"
    FULL_WIDTH = 1, "full width"


class StyleSideChoices(Enum):
    LEFT = 0, "left"
    CENTER = 1, "center"
    RIGHT = 2, "right"


class StatusPhotoChoices(Enum):
    NEW = "new", "new"
    POSITIONED = "positioned", "positioned at last configuration"
    UNPOSITIONED = "unpositioned", "not positioned"


@dataclass
class FileElementEntry:
    uuid: Optional[str] = ""
    file: Optional[str] = ""
    status: Optional[str] = ""
    styleSize: Optional[int] = 0
    styleSide: Optional[int] = 0
    order: Optional[int] = 0
    isDropped: bool = False


@dataclass
class FileRowEntry:
    files: List[FileElementEntry]
    uuid: str
    order: int
    className: str
    styleColumn: int

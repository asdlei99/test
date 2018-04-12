"""
String processing

"""

# coding=utf-8
import sys
import re


def str_len(string):
    """
    中文/其他非ASCII字符按照2个英文字符算
    :param string:
    :return:
    """
    length = None
    encoding = sys.getdefaultencoding()
    if encoding == 'utf-8':
        # Linux liked system
        length = len(string.encode('gbk'))
    else:
        # TODO: 系统编码不为utf-8时
        pass
    return length


def str2digit(string, default=None):
    """
    String to Digit
    :param string: object to convert
    :param default: default result if convert failed
    :return:
    """
    assert isinstance(string, (str, int, float))
    if isinstance(string, (int, float)):
        return string
    else:
        if string.isdigit():
            return int(string)
        elif re.match(r'\d+\.?\d+', string):
            return float(string)
        else:
            if default and isinstance(default, int):
                return default
            else:
                return


def obj2iter(obj):
    """
    Simply translate an common object to an iteration object
    :param obj: str, int, float, list, tuple
    :return:
    """
    return obj if isinstance(obj, (list, tuple, dict)) else [obj]

import base58
from hashlib import blake2b

# Python Substrate Interface
#
# Copyright 2018-2020 openAware BV (NL).
# This file is part of Polkascan.
#
# Polkascan is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Polkascan is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Polkascan. If not, see <http://www.gnu.org/licenses/>.
#
#  ss58.py

def ss58_decode(address, valid_address_type=None):
    """
    Decodes given SS58 encoded address to an account ID
    Parameters
    ----------
    address: e.g. EaG2CRhJWPb7qmdcJvy3LiWdh26Jreu9Dx6R1rXxPmYXoDk
    valid_address_type
    Returns
    -------
    Decoded string AccountId
    """
    checksum_prefix = b'SS58PRE'

    ss58_format = base58.b58decode(address)

    if valid_address_type and ss58_format[0] != valid_address_type:
        raise ValueError("Invalid Address type")

    # Determine checksum length according to length of address string
    if len(ss58_format) in [3, 4, 6, 10]:
        checksum_length = 1
    elif len(ss58_format) in [5, 7, 11, 35]:
        checksum_length = 2
    elif len(ss58_format) in [8, 12]:
        checksum_length = 3
    elif len(ss58_format) in [9, 13]:
        checksum_length = 4
    elif len(ss58_format) in [14]:
        checksum_length = 5
    elif len(ss58_format) in [15]:
        checksum_length = 6
    elif len(ss58_format) in [16]:
        checksum_length = 7
    elif len(ss58_format) in [17]:
        checksum_length = 8
    else:
        raise ValueError("Invalid address length")

    checksum = blake2b(checksum_prefix + ss58_format[0:-checksum_length]).digest()

    if checksum[0:checksum_length] != ss58_format[-checksum_length:]:
        raise ValueError("Invalid checksum")

    return ss58_format[1:len(ss58_format)-checksum_length]

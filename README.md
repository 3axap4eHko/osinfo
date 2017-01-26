# Information about OS

## Installation

``` bash
npm install -g osinfo
```

## Usage
Help
``` bash
osinfo --help
```

Get Os Info in xml format
``` bash
osinfo -f xml
```
Result structure
``` yaml
platform:   # platform info
  arch:         # architecture
  type:         # platform type
  release:      # release version
  name:         # platform name

disks:      # array of disks
  - disk:       # name/label
    total:      # total size
    free:       # free space
    path:       # drive path
cpus:       # cpus info
  list:         # array of cpus
    - model:        # model
      speed:        # speed
      times:        # times
  loadavg:  # cpus load avg (not for Window platforms)
memory:     # RAM info
  free:         # free
  total:        # total
env:        # environment info
  endianness:   # OS endianness
  vars:         # Environment variables
  homedir:      # home directory
  hostname:     # hostname
networks:   # network interfaces
  name:         # array of available IPv6 and IPv4 network interfaces for network name
    - address:      # IP address
      netmask:      # network mask
      family:       # IPv6 or IPv4
      mac:          # network interface mac address
      scopeid:      # scopied
      internal:     # is internal true/false
```

## License

The MIT License Copyright (c) 2017-present Ivan Zakharchenko

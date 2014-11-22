Voids (void-oid objects)
=====

1986 Craig Reynolds developed an algorithm to simulate flocking birds by applying simple rule: Keep distance to your neighbors, but tend to the center of surrounding birds as well as the same direction as everyone else. These rules yield a suprisingly convincing flock of birds.

This is an implementation in JavaScript where every rules can be activated or deactivated individually.

![voids](docs/images/voids.gif)

## Installation

```
git clone git@github.com:maerch/voids.git

cd voids
npm install
gulp &

cd public
python -m SimpleHTTPServer 8080
```

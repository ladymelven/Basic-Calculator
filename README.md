# Basic-Calculator
A JS calculator with some basic styling. Does arithmetics, square root and square. Can process numerical expressions.

This is my first fully independent project (that is, no tutorials or peeking at how-tos, just using what I learned and some hard googling =) ).
Looking forward to any feedback, please share your thoughts and critique!

Thanks @hjoeftung for testing!

Under the hood the calculation is performed this way:
1) Two categories of input: an array containing all operations and operands; and a number that is currently being manipulated

2) All powering is done immediately, tough not reflected in UI (the display just adds a radical or '^2' for square)

3) The sign is changed immediately, UI updates accordingly

4) Arithmetic operators are pushed to input array. Each time the user hits a +-*/ button, the current number is pushed to input array 
and becomes inaccessible. After that the operator itself is pushed.

5) The user can change the last operator. In case she enters something like '1 - 2' and changes sign of 2, the operator is also replaced.

6) The calculation is done only when user hits the = button. I used eval() for calculation previously, but then changed it to a hand-coded
function - considering the potential danger of eval() and also for the sake of excercise.

7) After calculation, the input array resets, and the result becomes the new current number.

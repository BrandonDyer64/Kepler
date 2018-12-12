
function Create ()
  for ku_Repeat_1 = 1, 100, 1 do
    if (((ku_Repeat_1 % 3) == 0) and (0 == (ku_Repeat_1 % 5))) then
      print("FizzBuzz")
    else
      if ((ku_Repeat_1 % 3) == 0) then
        print("Fizz")
      else
        if (0 == (ku_Repeat_1 % 5)) then
          print("Buzz")
        else
          print(ku_Repeat_1)
        end
      end
    end
  end
  
end

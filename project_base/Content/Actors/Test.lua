
function Create ()
  for ku_Repeat = 1, 100, 1 do
    if (((ku_Repeat % 3) == 0) and (0 == (ku_Repeat % 5))) then
      print("FizzBuzz")
    else
      if ((ku_Repeat % 3) == 0) then
        print("Fizz")
      else
        if (0 == (ku_Repeat % 5)) then
          print("Buzz")
        else
          print(ku_Repeat)
        end
      end
    end
  end
  
end

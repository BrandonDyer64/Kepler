
function Create ()
  local sum = 1
  for ku_Repeat = 1, 999, 1 do
    if (((ku_Repeat % 3) == 0) or (0 == (ku_Repeat % 5))) then
      sum = (ku_Repeat + sum)
    else
      
    end
  end
  print(sum)
end

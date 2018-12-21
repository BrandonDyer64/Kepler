
function Create (entity)
  for i = 1, 100, 1 do
    local output = ""
    
    if i % 3 == 0 then output = output .. "Fizz" end
    if i % 5 == 0 then output = output .. "Buzz" end
    
    if output == "" then
      output = i
    end
    
    print(output)
  end
end

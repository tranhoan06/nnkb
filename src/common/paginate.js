module.exports = (page, total, delta = 2)=>{
  const pages=[];
  let left = page - delta;
  let right = page + delta;
  for(let i = 1; i <= total; i++){
    if(i == 1 || i == total || i == page || (i >= left && i <=right))
      pages.push(i)
    if( (i == left - 1) || (i == right + 1))
      pages.push("...")
  }
  return pages
} 
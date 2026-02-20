const body = {
  name: qs('#newTitle').value,
  description: qs('#newDesc').value,
  price: Number(qs('#newPrice').value) || 0,
  image: qs('#newImage').value,
  section: qs('#newSection').value
};

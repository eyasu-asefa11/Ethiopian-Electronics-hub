// Clear all registered shops from localStorage
console.log('Clearing all registered shops...');

// Clear registered shops
localStorage.removeItem('registeredShops');

// Clear any other shop-related data
localStorage.removeItem('contactRequests');
localStorage.removeItem('messages');
localStorage.removeItem('visitors');

// Clear any products associated with shops
const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
if (shops.length === 0) {
    console.log('All shops have been successfully removed!');
} else {
    console.log('Some shops may still exist. Manual clearing...');
    localStorage.setItem('registeredShops', JSON.stringify([]));
}

console.log('Shop data cleared. Ready for new shop registration!');

// Refresh the page to see changes
setTimeout(() => {
    window.location.reload();
}, 1000);

import type { Order } from "@/types/order";

const customers = [
  {
    _id: 'cust1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '0901234567',
  },
  {
    _id: 'cust2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '0901234568',
  },
  {
    _id: 'cust3',
    name: 'Mike Davis',
    email: 'mike@example.com',
    phone: '0901234569',
  },
  {
    _id: 'cust4',
    name: 'Emily Brown',
    email: 'emily@example.com',
    phone: '0901234570',
  },
  {
    _id: 'cust5',
    name: 'David Wilson',
    email: 'david@example.com',
    phone: '0901234571',
  },
];

const sampleItems = [
  {
    _id: 'pet1',
    name: 'Golden Retriever Puppy',
    price: 12000000,
    type: 'pet' as const,
  },
  {
    _id: 'prod1',
    name: 'Premium Dog Food',
    price: 1200000,
    type: 'product' as const,
  },
  { _id: 'prod2', name: 'Dog Collar', price: 320000, type: 'product' as const },
  {
    _id: 'pet2',
    name: 'Pomeranian White',
    price: 6900000,
    type: 'pet' as const,
  },
  {
    _id: 'prod3',
    name: 'Dog Toy Set',
    price: 450000,
    type: 'product' as const,
  },
];

const statuses: Order['status'][] = [
  'pending',
  'processing',
  'delivered',
  'cancelled',
  'pending_refund',
  'refunded',
];
const paymentStatuses: Order['paymentStatus'][] = ['pending', 'paid', 'failed'];

export const generateMockOrders = (count: number = 25): Order[] => {
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const orderItems = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const item = sampleItems[Math.floor(Math.random() * sampleItems.length)];
      const quantity =
        item.type === 'pet' ? 1 : Math.floor(Math.random() * 3) + 1;
      const itemSubtotal = item.price * quantity;

      orderItems.push({
        type: item.type,
        item: {
          _id: item._id,
          name: item.name,
          price: item.price,
        },
        quantity,
        subtotal: itemSubtotal,
      });

      subtotal += itemSubtotal;
    }

    const tax = Math.round(subtotal * 0.1); // 10% tax
    const shipping = subtotal > 5000000 ? 0 : 150000; // Free shipping over 5M
    const total = subtotal + tax + shipping;

    const orderDate = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    );
    const estimatedDelivery = new Date(
      orderDate.getTime() + (Math.random() * 7 + 3) * 24 * 60 * 60 * 1000,
    );

    const order: Order = {
      _id: `order_${i + 1}`,
      orderNumber: `ORD-${String(1000 + i).padStart(4, '0')}`,
      customer,
      items: orderItems,
      totalItems: orderItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      tax,
      shipping,
      total,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus:
        paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      shippingAddress: {
        street: `${Math.floor(Math.random() * 999) + 1} Main Street`,
        city: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Can Tho'][
          Math.floor(Math.random() * 4)
        ],
        state: 'Vietnam',
        zipCode: String(Math.floor(Math.random() * 90000) + 10000),
      },
      orderDate: orderDate.toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
      notes: Math.random() > 0.7 ? 'Please handle with care' : undefined,
      createdAt: orderDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(order);
  }

  return orders.sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
  );
};

export const mockOrders = generateMockOrders(25);

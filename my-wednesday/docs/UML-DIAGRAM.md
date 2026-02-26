# Diagram UML - Hotel Booking Frontend

Dokumen ini berisi diagram UML untuk aplikasi Hotel Booking (Vue 3).

---

## 1. Class Diagram - Model Data

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Hotel       │     │      Room       │     │    Booking      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id: string      │1   *│ id: string      │1   *│ id: string      │
│ name: string    │─────│ roomNumber: str │─────│ roomId: string  │
│ location: string│     │ type: string    │     │ room: Room     │
└─────────────────┘     │ price: number   │     │ customerName    │
                         │ hotel: Hotel    │     │ checkInDate     │
                         └─────────────────┘     │ checkOutDate    │
                                                  │ status: string  │
                                                  └─────────────────┘
```

---

## 2. Use Case Diagram (Mermaid)

```mermaid
flowchart TB
    subgraph Customer
        UC1[Lihat Hotel]
        UC2[Lihat Kamar]
        UC3[Cek Ketersediaan]
        UC4[Booking Kamar]
        UC5[Riwayat Booking]
        UC6[Batalkan Booking]
    end
    
    subgraph Admin
        UC7[Kelola Hotel CRUD]
        UC8[Kelola Kamar CRUD]
        UC9[Kelola Booking]
    end
    
    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
```

---

## 3. Use Case - Actor & Use Case (Teks)

| Actor   | Use Case                    | Deskripsi                          |
|---------|-----------------------------|------------------------------------|
| Guest   | Lihat daftar hotel          | Tanpa login                        |
| Guest   | Lihat detail hotel & kamar  | Tanpa login                        |
| Guest   | Cek ketersediaan kamar      | Input tanggal check-in/out         |
| Customer| Login / Register            | Auth                               |
| Customer| Booking kamar               | Perlu login                        |
| Customer| Riwayat booking             | Lihat daftar booking sendiri       |
| Customer| Batalkan booking            | Jika status BOOKED                 |
| Admin   | Kelola hotel (CRUD)         | Tambah/Edit/Hapus hotel            |
| Admin   | Kelola kamar (CRUD)         | Tambah/Edit/Hapus kamar per hotel  |
| Admin   | Kelola booking              | Lihat semua, batalkan              |

---

## 4. Sequence Diagram - Alur Booking (Mermaid)

```mermaid
sequenceDiagram
    participant U as User
    participant V as Vue (HotelView)
    participant A as API
    participant B as Backend

    U->>V: Pilih tanggal check-in/out
    V->>A: getRoomAvailability(roomId, checkIn, checkOut)
    A->>B: GET /rooms/{id}/availability
    B-->>A: { available: true/false }
    A-->>V: response
    V->>V: Update roomAvailability
    U->>V: Klik Pesan (jika available)
    V->>V: router.push /book?roomId=...
    U->>V: Konfirmasi booking
    V->>A: createBooking({ roomId, checkInDate, checkOutDate })
    A->>B: POST /bookings (Authorization)
    B-->>A: booking created
    A-->>V: success
    V->>V: router.push /success
```

---

## 5. Component Diagram - Struktur Frontend

```
┌──────────────────────────────────────────────────────────────────┐
│                         App.vue                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   AppHeader     │  │  RouterView     │  │   AppFooter     │  │
│  └─────────────────┘  └────────┬────────┘  └─────────────────┘  │
└────────────────────────────────┼─────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐    ┌───────────────────┐    ┌───────────────────┐
│  HomeView     │    │  HotelsView       │    │  HotelView         │
│  - Slider     │    │  - HotelCard[]    │    │  - RoomCard[]      │
│  - CTA        │    │  - Filter         │    │  - Filter          │
└───────────────┘    └───────────────────┘    │  - Availability   │
                                              └───────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐    ┌───────────────────┐    ┌───────────────────┐
│  BookingView   │    │  BookingsView     │    │  AdminHotelsView   │
│  - Form        │    │  - Daftar booking │    │  - CRUD Hotel      │
│  - Konfirmasi  │    │  - Filter         │    └───────────────────┘
└───────────────┘    └───────────────────┘             │
                                                         ▼
                                              ┌───────────────────┐
                                              │AdminHotelRoomsView │
                                              │  - CRUD Kamar      │
                                              │  - Auto no.kamar   │
                                              └───────────────────┘
```

---

## 6. State Diagram - Status Booking

```mermaid
stateDiagram-v2
    [*] --> BOOKED: POST /bookings
    BOOKED --> CANCELLED: PUT /bookings/{id}/cancel
    CANCELLED --> [*]
```

---

## 7. Activity Diagram - Tambah Kamar (Admin)

```mermaid
flowchart TD
    A[Klik Tambah Kamar] --> B[Form muncul]
    B --> C[No. Kamar auto-fill 3 digit]
    C --> D[Pilih tipe: STANDARD/DELUXE/SUITE]
    D --> E[Input harga]
    E --> F{Klik Simpan?}
    F -->|Ya| G[POST /rooms]
    F -->|Batal| H[Form tutup]
    G --> I{Berhasil?}
    I -->|Ya| J[Reload daftar kamar]
    I -->|Tidak| K[Tampil error]
    J --> H
```

---

## 8. Entity Relationship (Konseptual)

```
Hotel (1) ──────< (*) Room
   │                    │
   │                    │
   └────────────────────┼──────< (*) Booking
                        │            │
                        │            └── customerName (User)
                        └── hotelId
```

---

## Cara Render Mermaid

- **VS Code:** Install ekstensi "Mermaid Preview"
- **GitHub:** Paste di file .md, otomatis di-render
- **Online:** [mermaid.live](https://mermaid.live)

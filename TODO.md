# TODO: Integrate API in Reservations Page

- [x] Import reservationApi in src/pages/Reservations.jsx
- [x] Add state for reservations array, loading, and error
- [x] Add useEffect to fetch reservations using reservationApi.getAll() on component mount
- [x] Update handleSaveReservation to call reservationApi.create() and refresh reservations list
- [x] Remove mock data from Reservations.jsx
- [ ] Test API integration (backend must be running)

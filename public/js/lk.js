
/** Скрывать "пейджер" если всё уместилось на одной странице */
const TURN_OFF_PAGER_FOR_ONE_PAGE = false;
// const TURN_OFF_PAGER_FOR_ONE_PAGE = true;

const MAX_ORDERS_PER_PAGE = 5;
// const MAX_ORDERS_PER_PAGE = 1;

const apiBase = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/';
const apiKeyPostfix = '?api_key=667134bc-821e-4764-82b6-9949b611a421';


// Дожидаемся загрузки страницы, перед тем как что-то делать
const onIndexPageContentLoaded = async () => {

	let coursesList = [];
	try {
		const coursesResponse = await fetch(apiBase + 'courses' + apiKeyPostfix);
		coursesList = await coursesResponse.json();
	} catch (err) { /* Считаем, нет курсов */ }

	/** Группирует записи из start_dates по дате */
	const splitDateTimes = course => {
		const startDateTimes = course?.start_dates || [];

		const groupedDateTimes = startDateTimes.reduce((acc, dateTime) => {
			const [date, time] = dateTime.split('T');
			acc[date] ||= [];
			acc[date].push(time);

			return acc;
		}, {});

		course.grouped_date_times = groupedDateTimes;
	};

	coursesList.forEach(splitDateTimes);

	let ordersList = [];
	try {
		const ordersListResp = await fetch(apiBase + 'orders' + apiKeyPostfix);
		ordersList = await ordersListResp.json();
	} catch (err) { /* Считаем, нет заявок */ }

	const notifyArea = document.getElementById('notify-area');

	const showAlert = (msg = 'Fogotten alert message text', alertType = 'light') => {
		notifyArea.innerHTML +=
			`
				<div class="alert ${'alert-' + alertType} px-4 py-2">
					${msg}
				</div>
			`;

		// Через 5 сек удаляем
		setTimeout(() => notifyArea.innerHTML = '', 5000);

	};

	const successAlert = msg => showAlert(msg, 'success');
	const errAlert = msg => showAlert(msg, 'danger');

	// Отбрасываем секунды
	const refuseSec = time =>
		time.split(':').slice(0, 2).join(':');

	/** Показываем элементы */
	const reveal = (...elements) =>
		elements.forEach(element => element?.classList.remove('d-none'));

	/** Прячем элементы */
	const conceal = (...elements) =>
		elements.forEach(element => element?.classList.add('d-none'));

	/** Переключение цифровых кнопок "пейджера" */
	const vitalizePager = (pager, latest, switcher) => {
		const onClick = evt => {
			evt.preventDefault();

			const target = evt.target;
			const index = target.dataset['index'];

			if (index) {
				const numbered = [...pager.querySelector('ul').children]
					.map(li => li?.children[0]);

				const current = numbered.find(link =>
					link?.classList.contains('active'));

				const currentID = +current?.dataset['index'];

				if (currentID === +index) return;
				if ((currentID === 1) && (index === 'previous')) return;
				if ((currentID === latest) && (index === 'next')) return;

				numbered.forEach(link => link?.classList.remove('active'));

				if ((index === 'next') || (index === 'previous')) {
					const nextID = index === 'next' ? currentID + 1 : currentID - 1;

					const newActiveIndex =
						numbered.findIndex(link => +link?.dataset['index'] === nextID);

					numbered[newActiveIndex]?.classList.add('active');

					if (switcher) switcher(nextID);
					return;
				};

				target.classList.add('active');
				if (switcher) switcher(index);
			}
		};

		pager.addEventListener('click', onClick);
	};

	const numberOfPages = (len, max) => {
		const div = len / max;
		const rounded = Math.floor(div);

		return div === rounded ? rounded : rounded + 1;
	};

	/** Шаблон для формирования "пейджера" на основе общего количества записей 
	и максимального количества записей на странице */
	const paginationTemplate = (num, max, id = '') => {
		const di = id ? `id="${id}"` : '';

		const pagesNumber = numberOfPages(num, max);

		const paginationInner = [...Array(pagesNumber)]
			.map((noMatter, index) =>
				`<li class="page-item">
					<a class="page-link" data-index="${index + 1}" href="#">${index + 1}</a>
				</li>`)
			.join('\n');

		// Если набралось только на одну страницу, отключаем кнопки вперёд/назад
		const disabled = pagesNumber > 1 ? '' : 'disabled';

		const markup =
			`
				<ul ${di} class="pagination justify-content-center">
					<li class="page-item d-sm-none">
						<a class="page-link ${disabled}" href="#" data-index="previous"
							aria-label="Previous" 
							aria-disabled="${!!disabled}">

							<span aria-hidden="true">&laquo;</span>
						</a>
					</li>

					<li class="page-item d-none d-sm-flex">
						<a class="page-link ${disabled}" href="#" data-index="previous"
							aria-disabled="${!!disabled}">

							Previous
						</a>
					</li>

					${paginationInner}

					<li class="page-item d-none d-sm-flex">
						<a class="page-link ${disabled}" href="#" data-index="next"
							aria-disabled="${!!disabled}">

							Next
						</a>
					</li>

					<li class="page-item d-sm-none">
						<a class="page-link ${disabled}" href="#" data-index="next"
							aria-label="Next"
							aria-disabled="${!!disabled}">

							<span aria-hidden="true">&raquo;</span>
						</a>
					</li>
				</ul>
			`;

		return markup;
	};

	/** Формирует содержимое "страницы" - подмножество элементов */
	const getTablearkup = (itemsList, perPage, pageNum = 1) => {
		const start = (pageNum - 1) * perPage;
		const end = start + perPage;

		return itemsList.slice(start, end).map(item =>
			`
				<tr>
					<td class="border">${item.id}</td>

					<td class="border">
						${coursesList.find(course => course.id === item.course_id)?.name}
					</td>

					<td class="border">${item.date_start}</td>
					<td class="border">${item.price}</td>

					<td class="border">
						<a href="#" id="cancel-order" data-id="${item.id}">Cancel</a>
						<a href="#" id="upd-order" data-id="${item.id}" data-bs-toggle="modal"
							data-bs-target="#updCourseModal"  data-bs-whatever="${item.id}">

							Edit
						</a>
					</td>
				</tr>
			`)
			.join('\n');
	};

	const ordersTableBody = document.getElementById('orders-table-body');

	const showCoursesList = (pageNum = 1) => {
		ordersTableBody.innerHTML =
			getTablearkup(ordersList, MAX_ORDERS_PER_PAGE, pageNum);
	};

	showCoursesList();

	// Настраиваем пагинацию

	const ordersListPagination = document?.querySelector('#orders-list-pagination');

	const pagesNumber =
		numberOfPages(ordersList.length, MAX_ORDERS_PER_PAGE);

	if (!TURN_OFF_PAGER_FOR_ONE_PAGE || (pagesNumber !== 1))
		reveal(ordersListPagination);

	ordersListPagination.innerHTML =
		paginationTemplate(ordersList.length, MAX_ORDERS_PER_PAGE);

	ordersListPagination.querySelector('[data-index="1"]')
		?.classList.add('active');

	vitalizePager(ordersListPagination, pagesNumber, showCoursesList);


	// Удаление заявки

	const onActionClick = async evt => {
		evt.preventDefault();

		const target = evt.target;

		if (target?.id === 'cancel-order') {
			try {
				const orderID = target?.dataset['id'];

				const res = await fetch(apiBase + 'orders/' + orderID + apiKeyPostfix,
					{ method: 'DELETE', });

				target?.closest('tr').remove();

				successAlert('Canceled');
			} catch (err) {
				console.error(err);
				errAlert('Fail');
			}
		}
	};

	ordersTableBody.addEventListener('click', onActionClick);


	// Оживляем модалку редактирования курса
	const updCourseModal = document.getElementById('updCourseModal');
	const reqCourseName = updCourseModal.querySelector('#req-course-name');
	const reqTutorName = updCourseModal.querySelector('#req-tutor-name');
	const reqStartDate = updCourseModal.querySelector('#req-start-date');
	const reqStartTime = updCourseModal.querySelector('#req-start-time');
	const reqCourseDuration = updCourseModal.querySelector('#req-course-duration');
	const reqStudentsNumber = updCourseModal.querySelector('#req-students-number');
	const reqTotalCost = updCourseModal.querySelector('#req-total-cost');
	const reqCalc = updCourseModal.querySelector('#req-calc');
	const reqSend = updCourseModal.querySelector('#req-send');

	const reqAddOptsupplementary =
		updCourseModal.querySelector('#req-add-opt-supplementary');

	const reqAddOptPersonalized =
		updCourseModal.querySelector('#req-add-opt-personalized');

	const reqAddOptExcursions =
		updCourseModal.querySelector('#req-add-opt-excursions');

	const reqAddOptAssessment =
		updCourseModal.querySelector('#req-add-opt-assessment');

	const reqAddOptInteractive =
		updCourseModal.querySelector('#req-add-opt-interactive');

	let latestOrder = {};
	let latestCourse = {};


	// Время от выбранной даты

	const updateTimesList = date => {
		// console.log(date);
		const groupedDateTimes = latestCourse?.grouped_date_times || {};
		const times = groupedDateTimes[date] || [];

		if (times.length) {
			reqStartTime.innerHTML = times
				.map(time => `<option value="${refuseSec(time)}">${refuseSec(time)}</option>`);

			reqStartTime.removeAttribute('disabled');
		}
		else {
			reqStartTime.innerHTML = 'No known times';
			reqStartTime.setAttribute('disabled', true);
		}
	};


	// 

	const onDateSwitch = evt => updateTimesList(evt.target.value);
	reqStartDate.addEventListener('change', onDateSwitch);

	const onCalc = () => {
		const courseFeePerHour = latestCourse.course_fee_per_hour;
		const courseTotalLength = latestCourse.total_length;
		const courseWeekLength = latestCourse.week_length;
		const durationInHours = courseTotalLength * courseWeekLength;
		const studentsNumber = reqStudentsNumber?.value || 1;
		const isWeekendOrHoliday = 1;
		const morningSurcharge = 0;
		const eveningSurcharge = 0;

		const total = Math.floor(((courseFeePerHour * durationInHours * isWeekendOrHoliday) + morningSurcharge + eveningSurcharge) * studentsNumber);

		reqTotalCost.innerHTML = total;
	};

	reqCalc.addEventListener('click', onCalc);

	const onSend = async () => {

		// Берём из полей формы и не только

		const course_id = latestCourse?.id;
		const date_start = reqStartDate?.value;
		const time_start = reqStartTime?.value;
		const persons = reqStudentsNumber?.value || 1;
		const duration = 1; // Временно
		const price = 1; // Временно

		if (!course_id || !date_start || !time_start || !persons || !duration || !price)
			return errAlert('Wrong data');

		try {
			const body = JSON.stringify({
				course_id, date_start, time_start, persons, duration, price,
			});

			await fetch(apiBase + 'orders/' + latestOrder.id + apiKeyPostfix,
				{
					method: 'PUT',
					headers: { "Content-Type": "application/json", },
					body,

				});

		} catch (err) {
			console.error(err);
			return errAlert('Request fail!');
		}

		successAlert('Done!');
	};

	reqSend.addEventListener('click', onSend);

	const onUpdOrderModalShow = evt => {
		const link = evt.relatedTarget;
		const orderID = +link.getAttribute('data-bs-whatever');

		const order = latestOrder = ordersList
			.find(order => order.id === orderID);

		const course = latestCourse =
			coursesList.find(course => course.id === order.course_id);

		if (!orderID || !order || !course) return;

		reqCourseName.value = course?.name || '-';
		reqTutorName.value = course?.teacher || 'unknown';

		const groupedDateTimes = course?.grouped_date_times || {};
		const dates = Object.keys(groupedDateTimes);

		if (course?.start_dates.length) {
			reqStartDate.innerHTML = dates
				.map(date => `<option value="${date}">${date}</option>`);

			reqStartDate.removeAttribute('disabled');
		}

		if (course?.start_dates?.length) {
			const selectedDate = dates[0];
			updateTimesList(selectedDate);
		}

		reqCourseDuration.value = course?.total_length + ' weeks';
	};

	updCourseModal.addEventListener('show.bs.modal', onUpdOrderModalShow);
};

// Дожидаемся загрузки страницы, перед тем как что-то делать
document.addEventListener('DOMContentLoaded', onIndexPageContentLoaded);


/** Скрывать "пейджер" если всё уместилось на одной странице */
const TURN_OFF_PAGER_FOR_ONE_PAGE = false;
// const TURN_OFF_PAGER_FOR_ONE_PAGE = true;

const MAX_ORDERS_PER_PAGE = 5;
// const MAX_COURSES_PER_PAGE = 2;

const apiBase = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/';
const apiKeyPostfix = '?api_key=667134bc-821e-4764-82b6-9949b611a421';


// Дожидаемся загрузки страницы, перед тем как что-то делать
const onIndexPageContentLoaded = async () => {

	// let ordersList = [];
	// try {
	// 	const ordersList = await fetch(apiBase + 'orders' + apiKeyPostfix);
	// 	coursesList = await coursesResponse.json();
	// } catch (err) { /* Считаем, нет заявок */ }

	// Заглушка на время дебага, чтобы не делать бесконечные запросы к серверу
	const ordersList = [
		{
			"id": 348,
			"duration": 1,
			"persons": 1,
			"price": 1,
			"supplementary": false,
			"earlyRegistration": false,
			"groupEnrollment": false,
			"intensiveCourse": false,
			"personalized": false,
			"excursions": false,
			"assessment": false,
			"interactive": false,
			"tutor_id": 2,
			"course_id": 0,
			"date_start": "2025-02-10",
			"time_start": "10:00:00",
			"early_registration": false,
			"group_enrollment": false,
			"intensive_course": false,
			"student_id": 15,
			"created_at": "2025-01-20T13:29:12.025116714",
			"updated_at": "2025-01-20T13:29:12.025133784"
		},
		{
			"id": 349,
			"duration": 1,
			"persons": 2,
			"price": 1,
			"supplementary": false,
			"earlyRegistration": false,
			"groupEnrollment": false,
			"intensiveCourse": false,
			"personalized": false,
			"excursions": false,
			"assessment": false,
			"interactive": false,
			"tutor_id": 3,
			"course_id": 0,
			"date_start": "2025-03-15",
			"time_start": "15:00:00",
			"early_registration": false,
			"group_enrollment": false,
			"intensive_course": false,
			"student_id": 15,
			"created_at": "2025-01-20T13:31:50.508164867",
			"updated_at": "2025-01-20T13:31:50.508180747"
		}
	];

	const notifyArea = document.getElementById('notify-area');

	const showAlert = (msg = 'Fogotten alert message text', alertType = 'light') => {
		notifyArea.innerHTML +=
			`
				<div class="alert ${'alert-' + alertType} px-4 py-2">
					${msg}
				</div>
			`;
		console.log('asdf');
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
				<tr role="button">
					<td class="border">${item.id}</td>
					<td class="border">${item.course_id}</td>
					<td class="border">${item.date_start}</td>
					<td class="border">${item.price}</td>

					<td class="border">
						<a href="#" id="cancel-order">Cancel</a>
						<a href="#" id="upd-order" data-id="${item.id}">Edit</a>
					</td>
				</tr>
			`)
			.join('\n');
	};


	const ordersTableBody = document.getElementById('orders-table-body');

	ordersTableBody.innerHTML = getTablearkup(ordersList, 20);



	// Оживляем модалку редактирования курса
	const requestCourseModal = document.getElementById('requestCourseModal');
	const reqCourseName = requestCourseModal.querySelector('#req-course-name');
	const reqTutorName = requestCourseModal.querySelector('#req-tutor-name');
	const reqStartDate = requestCourseModal.querySelector('#req-start-date');
	const reqStartTime = requestCourseModal.querySelector('#req-start-time');
	const reqCourseDuration = requestCourseModal.querySelector('#req-course-duration');
	const reqStudentsNumber = requestCourseModal.querySelector('#req-students-number');
	const reqTotalCost = requestCourseModal.querySelector('#req-total-cost');
	const reqCalc = requestCourseModal.querySelector('#req-calc');
	const reqSend = requestCourseModal.querySelector('#req-send');

	const reqAddOptsupplementary =
		requestCourseModal.querySelector('#req-add-opt-supplementary');

	const reqAddOptPersonalized =
		requestCourseModal.querySelector('#req-add-opt-personalized');

	const reqAddOptExcursions =
		requestCourseModal.querySelector('#req-add-opt-excursions');

	const reqAddOptAssessment =
		requestCourseModal.querySelector('#req-add-opt-assessment');

	const reqAddOptInteractive =
		requestCourseModal.querySelector('#req-add-opt-interactive');

	let latestCourse = [];



	// Время от выбранной даты
	const updateTimesList = date => {
		const groupedDateTimes = latestCourse?.grouped_date_times || {};
		const times = groupedDateTimes[date] || [];

		if (times.length) {
			reqStartTime.innerHTML = times
				.map(time => `<option value="${refuseSec(time)}">${refuseSec(time)}</option>`);

			reqStartTime.removeAttribute('disabled');
		}
		else {
			reqStartTime.innerHTML = 'No known times';
			reqStartTime.setAttribute('disabled');
		}
	};

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

		const tutor_id = latestCourse?.id;
		const date_start = reqStartDate?.value;
		const time_start = reqStartTime?.value;
		const persons = reqStudentsNumber?.value || 1;
		const duration = 1; // Временно
		const price = 1; // Временно

		if (!tutor_id || !date_start || !time_start || !persons || !duration || !price)
			return errAlert('Wrong data');

		try {
			const body = JSON.stringify({
				tutor_id, date_start, time_start, persons, duration, price,
			});

			await fetch(apiBase + 'orders' + apiKeyPostfix,
				{
					method: 'POST',
					headers: { "Content-Type": "application/json", },
					body,
				}
			);
		} catch (err) {
			console.error(err);
			return errAlert('Request fail!');
		}

		successAlert('Done!');
	};

	reqSend.addEventListener('click', onSend);

	const onRequestCourseModalShow = evt => {
		const link = evt.relatedTarget;
		const courseID = +link.getAttribute('data-bs-whatever');

		const course = latestCourse = coursesList
			.find(course => course.id === courseID);

		if (!courseID || !course) return;

		reqCourseName.value = course?.name || '-';
		reqTutorName.value = course?.teacher || 'unknown';

		const groupedDateTimes = course?.grouped_date_times || {};
		const dates = Object.keys(groupedDateTimes);

		if (course?.start_dates.length) {
			reqStartDate.innerHTML = dates
				.map(date => `<option value="${date}">${date}</option>`);

			reqStartDate.removeAttribute('disabled');
		}

		if (course?.start_dates.length) {
			const selectedDate = dates[0];
			updateTimesList(selectedDate);
		}

		reqCourseDuration.value = course?.total_length + ' weeks';
	};

	requestCourseModal.addEventListener('show.bs.modal', onRequestCourseModalShow);
};

// Дожидаемся загрузки страницы, перед тем как что-то делать
document.addEventListener('DOMContentLoaded', onIndexPageContentLoaded);

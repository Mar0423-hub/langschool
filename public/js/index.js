
/** Скрывать "пейджер" если всё уместилось на одной странице */
const TURN_OFF_PAGER_FOR_ONE_PAGE = false;
// const TURN_OFF_PAGER_FOR_ONE_PAGE = true;

const MAX_COURSES_PER_PAGE = 10;
// const MAX_COURSES_PER_PAGE = 2;
const MAX_TUTORS_PER_PAGE = 10;
// const MAX_TUTORS_PER_PAGE = 2;

const apiBase = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/';
const apiKeyPostfix = '?api_key=667134bc-821e-4764-82b6-9949b611a421';


// Дожидаемся загрузки страницы, перед тем как что-то делать
const onIndexPageContentLoaded = async () => {

	let coursesList = [];
	try {
		const coursesResponse = await fetch(apiBase + 'courses' + apiKeyPostfix);
		coursesList = await coursesResponse.json();
	} catch (err) { /* Считаем, нет курсов */ }

	let tutorsList = [];
	try {
		const tutorsResponse = await fetch(apiBase + 'tutors' + apiKeyPostfix);
		tutorsList = await tutorsResponse.json();
	} catch (err) { /* Считаем, нет репетиторов */ }

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
	const getPageMarkup = (itemsList, perPage, pageNum = 1, request = 'course') => {
		const start = (pageNum - 1) * perPage;
		const end = start + perPage;

		const modalID = request === 'course'
			? 'requestCourseModal' : 'requestTutorModal';

		return itemsList.slice(start, end).map(item =>
			`<a href="#" data-id="${item.id}" 
				data-bs-toggle="modal" data-bs-target="#${modalID}" 
				data-bs-whatever="${item.id}"
				class="list-group-item list-group-item-action overflow-hidden">

				${item.name}
			</a>`)
			.join('\n');
	};

	/** ____ */
	// const vitalizePage = (page, clickHandler) => {};


	// Все существующие курсы с фильтрацией и без

	const filteredCoursesListBlock =
		document.getElementById('filtered-courses-list-block');

	const filteredCoursesListItself = filteredCoursesListBlock
		?.querySelector('#filtered-courses-list-itself');

	const noFilteredCoursesBanner = filteredCoursesListBlock
		?.querySelector('#no-filtered-courses-banner');

	const filteredCoursesListPagination = filteredCoursesListBlock
		?.querySelector('#filtered-courses-list-pagination');

	const filteredCoursesListHeader = filteredCoursesListBlock
		?.querySelector('#filtered-courses-list-header');

	filteredCoursesListBlock?.querySelector('.please-wait')?.remove();

	let filteredCoursesList = [...coursesList];

	const pagesNumber =
		numberOfPages(filteredCoursesList.length, MAX_COURSES_PER_PAGE);

	// Настраиваем пагинацию
	const tuneCoursesPagination = () => {
		if (!TURN_OFF_PAGER_FOR_ONE_PAGE || (pagesNumber !== 1))
			reveal(filteredCoursesListPagination);

		filteredCoursesListPagination.innerHTML =
			paginationTemplate(filteredCoursesList.length, MAX_COURSES_PER_PAGE);

		filteredCoursesListPagination.querySelector('[data-index="1"]')
			?.classList.add('active');
	};

	const showCoursesList = (pageNum = 1) => {
		reveal(filteredCoursesListItself);
		conceal(noFilteredCoursesBanner);

		filteredCoursesListItself.innerHTML =
			getPageMarkup(filteredCoursesList, MAX_COURSES_PER_PAGE, pageNum, 'course');
	};

	showCoursesList();
	tuneCoursesPagination();
	vitalizePager(filteredCoursesListPagination, pagesNumber, showCoursesList);

	// Обработчик нажатия на Search

	const onFilterCoursesFormSubmit = evt => {
		evt.preventDefault();

		const form = evt?.target;
		const name = form?.name.value || '';
		const level = form?.level.value || '';

		filteredCoursesList = coursesList
			.filter(course => !name || course.name.indexOf(name) !== -1)
			.filter(course => level === 'All' || level === course.level);

		reveal(filteredCoursesListBlock);

		if (!filteredCoursesList.length) {
			conceal(filteredCoursesListItself, filteredCoursesListPagination);
			reveal(noFilteredCoursesBanner);
		}

		if (filteredCoursesList.length) {
			filteredCoursesListHeader.innerHTML = 'Searched courses';
			showCoursesList();
			tuneCoursesPagination();
		}
	}

	const filterCoursesForm = document.getElementById('filter-courses-form');
	// Делаем кнопку доступной
	filterCoursesForm?.querySelector('.filter-course')?.removeAttribute('disabled');
	// Ставим обработчик отправки формы
	filterCoursesForm.addEventListener('submit', onFilterCoursesFormSubmit);


	// Что касается фильтрации репетиторов

	const filteredTutorsListBlock =
		document.getElementById('filtered-tutors-list-block');

	const filteredTutorsListItself = filteredTutorsListBlock
		?.querySelector('#filtered-tutors-list-itself');

	const noFilteredTutorsBanner = filteredTutorsListBlock
		?.querySelector('#no-filtered-tutors-banner');

	const filteredTutorsListPagination = filteredTutorsListBlock
		?.querySelector('#filtered-tutors-list-pagination');

	const filteredTutorsListHeader = filteredTutorsListBlock
		?.querySelector('#filtered-tutors-list-header');

	filteredTutorsListBlock?.querySelector('.please-wait')?.remove();

	let filteredTutorsList = [...tutorsList];

	const tutorsPagesNumber =
		numberOfPages(filteredTutorsList.length, MAX_TUTORS_PER_PAGE);

	// Настраиваем пагинацию
	const tuneTutorsPagination = () => {
		if (!TURN_OFF_PAGER_FOR_ONE_PAGE || (tutorsPagesNumber !== 1))
			reveal(filteredTutorsListPagination);

		filteredTutorsListPagination.innerHTML =
			paginationTemplate(filteredTutorsList.length, MAX_TUTORS_PER_PAGE);

		filteredTutorsListPagination.querySelector('[data-index="1"]')
			?.classList.add('active');
	};

	const showTutorsList = (pageNum = 1) => {
		reveal(filteredTutorsListItself);
		conceal(noFilteredTutorsBanner);

		filteredTutorsListItself.innerHTML =
			getPageMarkup(filteredTutorsList, MAX_TUTORS_PER_PAGE, pageNum, 'tutor');
	};

	const onTutorSelection = evt => {
		evt.preventDefault();

		const link = evt.target;
		const id = +link?.dataset['id'];

		if (!id) return;

		const entity = tutorsList.find(item => +item?.id === id);
	};

	showTutorsList();
	filteredTutorsListItself.addEventListener('click', onTutorSelection);
	tuneTutorsPagination();
	vitalizePager(filteredTutorsListPagination, tutorsPagesNumber, showTutorsList);

	// Обработчик нажатия на Search

	const onFilterTutorsFormSubmit = evt => {
		evt.preventDefault();

		const form = evt?.target;
		const expa = +form?.expa.value || 0;
		const level = form?.level.value || '';

		const filteredTutorsList = tutorsList
			.filter(tutor => tutor.work_experience >= expa)
			.filter(tutor => level === 'Any' || level === tutor.language_level);

		reveal(filteredTutorsListBlock);

		if (!filteredTutorsList.length) {
			conceal(filteredTutorsListItself, filteredTutorsListPagination);
			reveal(noFilteredTutorsBanner);
		}

		if (filteredTutorsList.length) {
			filteredTutorsListHeader.innerHTML = 'Searched tutors';
			showTutorsList();
			tuneTutorsPagination();
		}
	}

	const filterTutorsForm = document.getElementById('filter-tutors-form');
	// Делаем кнопку доступной
	filterTutorsForm?.querySelector('.filter-tutor')?.removeAttribute('disabled');
	// Ставим обработчик отправки формы
	filterTutorsForm.addEventListener('submit', onFilterTutorsFormSubmit);


	// Оживляем модалку заказа курса
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

	// Отбрасываем секунды
	const refuseSec = time =>
		time.split(':').slice(0, 2).join(':');

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
			reqStartTime.setAttribute('disabled', true);
		}
	};

	const onDateSwitch = evt => updateTimesList(evt.target.value);
	reqStartDate.addEventListener('change', onDateSwitch);

	const calcTotal = () => {
		const courseFeePerHour = latestCourse.course_fee_per_hour;
		const courseTotalLength = latestCourse.total_length;
		const courseWeekLength = latestCourse.week_length;
		const durationInHours = courseTotalLength * courseWeekLength;
		const studentsNumber = reqStudentsNumber?.value || 1;
		const isWeekendOrHoliday = 1;
		const morningSurcharge = 0;
		const eveningSurcharge = 0;

		return Math.floor(((courseFeePerHour * durationInHours * isWeekendOrHoliday) + morningSurcharge + eveningSurcharge) * studentsNumber);
	};

	const onCalc = () =>
		reqTotalCost.innerHTML = calcTotal();

	reqCalc.addEventListener('click', onCalc);

	const onSend = async () => {

		// Берём из полей формы и не только

		const course_id = latestCourse?.id;
		const date_start = reqStartDate?.value;
		const time_start = reqStartTime?.value;
		const persons = reqStudentsNumber?.value || 1;
		const duration = 1; // Временно
		const price = calcTotal();

		if (!course_id || !date_start || !time_start || !persons || !duration || !price)
			return errAlert('Wrong data');

		let attemptResult;

		try {
			const body = JSON.stringify({
				course_id, date_start, time_start, persons, duration, price,
			});

			attemptResult = await fetch(apiBase + 'orders' + apiKeyPostfix,
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

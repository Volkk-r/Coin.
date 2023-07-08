import { el } from 'redom';
import ymaps from 'ymaps';

export default class MapWithPoints {
    constructor(containerId, pointsData) {
        // Инициализация полей класса
        this._containerId = containerId;
        this._map = null;
        this._pointsData = pointsData;
        this._container = el('.map container', [
            el('h1.title.map__title', 'Карта банкоматов'),
            el('.map__wrapper', el('#map')),
        ]);
    }

    async initialize() {
        try {
            // Ожидание загрузки библиотеки ymaps
            await ymaps.ready();
            this.createMap();
            this.addPointsToMap();
            this.disableMapScroll();
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }

    createMap() {
        // Создание карты с заданными параметрами
        this._map = new ymaps.Map(this._containerId, {
            center: [55.76, 37.64],
            zoom: 4,
        });
    }

    addPointsToMap() {
        // Добавление точек на карту
        this._pointsData.forEach((point) => {
            const placemark = new ymaps.Placemark(
                [point.lat, point.lon],
                { hintContent: point.name }
            );
            this._map.geoObjects.add(placemark);
        });
    }

    disableMapScroll() {
        // Запрещаем скролл карты по умолчанию
        this._map.behaviors.disable("scrollZoom");

        // Добавляем обработчик события клика на карту
        this._map.events.add("click", () => {
            // Включаем скролл карты после клика
            this._map.behaviors.enable("scrollZoom");
        });
    }

    get html() {
        // Возвращение HTML-контейнера для отображения карты
        return this._container;
    }
}


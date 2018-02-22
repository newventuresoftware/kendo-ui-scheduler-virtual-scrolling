var data = data || {};

(function () {
    'use strict';

    var resourceNames = ['Jayden', 'Hopkins', 'Harrison', 'Byrne', 'Kyle', 'Hill', 'Aaron', 'Fox', 'Aimee', 'Macdonald', 'Charles', 'Howard', 'Keenan', 'Wade', 'Edward', 'Padilla', 'Chance', 'Shields', 'Damian', 'Pennington', 'Ameer', 'Bennett', 'Kian', 'Reid', 'Isabel', 'Wood', 'Henry', 'Robertson', 'Hannah', 'Webb', 'Joseph', 'Khan', 'Joel', 'May', 'Alfie', 'Allen', 'Ruben', 'Vance', 'Moses', 'Powell', 'Zayden', 'Stokes', 'Joe', 'Mccormick', 'Collin', 'Hopper', 'Alex', 'Burke', 'Imogen', 'Johnson'];
    var eventNames = ['Wine Festival', 'Remembrance Festival', 'King\'s Celebration', 'Emancipation Celebration', 'Feast Of Fire', 'Celebration Of Warmth', 'Feast Of Prosperity', 'Fest Of Death', 'Feast Of Language', 'Feast Of Respect', 'Midsummer Fest', 'National Youth Festival', 'Bravery Feast', 'Spirit Fest', 'Fest Of Literature', 'Festival Of Traditions', 'Celebration Of Waves', 'Feast Of Respect', 'Feast Of Cows', 'Day Of Games', 'Martyrs\' Feast', 'Republic Festival', 'Planting Feast', 'Solar Eclipse Festival', 'Day Of Nightmares', 'Day Of Harmony', 'Day Of Friendship', 'Festival Of The God', 'Fest Of Farming', 'Day Of Our Freedom', 'Midwinter Festival', 'Animal Festival', 'Fisher Fest', 'Empress\' Celebration', 'Celebration Of Fathers', 'Day Of Families', 'Celebration Of Farming', 'Feast Of Hope', 'Feast Of Paint', 'Celebration Of Remembrance', 'Ancestor Day', 'Independence Day', 'Culture Celebration', 'Traditional Day', 'Festival Of Sugar', 'Day Of Bounties', 'Celebration Of Oceans', 'Celebration Of Films', 'Feast Of Waves', 'Feast Of Flowers', 'All Souls Celebration', 'Sunset Festival', 'Traditional Fest', 'Clean Water Festival', 'Feast Of Strangers', 'Fest Of Technology', 'Fest Of Parents', 'Festival Of Beer', 'Day Of Safety', 'Fest Of Sports', 'Community Festival', 'Fertility Fest', 'Wine Festival', 'Music Day', 'Festival Of The Sea', 'Festival Of The Phoenix', 'Day Of Autumn', 'Fest Of Clean Water', 'Festival Of Harvests', 'Day Of Friendship', 'Victory Festival', 'Community Day', 'Parents Day', 'Summer Solstice Celebration', 'Fest Of Recreation', 'Celebration Of Summer', 'Day Of Literature', 'Festival Of Bread', 'Day Of Proclamation', 'Celebration Of Sport', 'Winter Solstice Festival', 'Dragon Day', 'King\'s Day', 'Teacher\'s Fest', 'Fest Of Generosity', 'Fest Of Time', 'Festival Of Rest', 'Celebration Of The New Moon', 'Festival Of Love', 'Day Of Comets', 'Proclamation Festival', 'Midwinter Celebration', 'Independence Festival', 'Winter Day', 'Festival Of The Seafarer', 'Celebration Of Dreams', 'Festival Of Ghosts', 'Fest Of Games', 'Fest Of Truth', 'Celebration Of Rest', 'Flag Festival', 'Independence Day', 'Rainbow Fest', 'Carnival Celebration', 'Feast Of Voices', 'Festival Of Blossoms', 'Fest Of The Stars', 'Feast Of Unity', 'Festival Of Cats', 'Festival Of Farming', 'Spring Day', 'Flag Festival', 'Spring Celebration', 'Diversity Day', 'Festival Of Birds', 'Fest Of Recreation', 'Feast Of The Republic', 'Festival Of Reflection', 'Day Of People', 'Fest Of Strangers', 'Dragon Fest', 'Sport Feast', 'Family Day', 'Farming Fest', 'Day Of Shadows', 'Feast Of Hymns', 'Fest Of Taverns', 'Fest Of Birds', 'Celebration Of Languages', 'Feast Of Diversity', 'Truth Festival', 'Fertility Fest', 'Bravery Celebration', 'Flag Fest', 'Day Of Film', 'Day Of Bread', 'Feast Of Conversation', 'Celebration Of Seafood', 'Fest Of Pollination', 'Celebration Of Auroras', 'Bliss Celebration', 'Midsummer Celebration', 'King\'s Festival', 'Children\'s Celebration', 'Celebration Of Respect', 'Feast Of The First Moon', 'Festival Of Resting Spirits', 'Festival Of Reflection', 'Festival Of Nightmares', 'Day Of Asteroids'];

    data.resources = generateResources(resourceNames);
    data.events = generateEvents(data.resources, eventNames);

    function generateResources(names) {
        var resources = [];
        var numberOfResources = 100;

        for (var i = 0; i < numberOfResources; i += 1) {
            var resource = {
                value: Math.ceil(Math.random() * 1000000000),
                text: names[Math.floor(names.length * Math.random())] + ' ' + names[Math.floor(names.length * Math.random())]
            };

            resources.push(resource);
        }

        return resources;
    }

    function generateEvents(resources, titles) {
        var events = [];
        var numberOfEventsPerResource = 10;
        var hoursIncrementor = 0.8;
        var startingHour = 9;
        var currentDay = new Date();
        var durationOffsetInMinutes = [45, 60, 75, 90];

        for (var i = 0, hours = startingHour; i < resources.length * numberOfEventsPerResource; i += 1, hours += hoursIncrementor) {
            hours = hours < (numberOfEventsPerResource * hoursIncrementor) + startingHour ? hours : startingHour;

            var start = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate(), hours, i % 2 === 0 ? 0 : 30);
            var end = new Date(start.getTime() + durationOffsetInMinutes[Math.floor(durationOffsetInMinutes.length * Math.random())] * 60000);

            var event = {
                id: Math.ceil(Math.random() * 1000000000),
                title: titles[Math.floor(titles.length * Math.random())],
                start: start,
                end: end,
                recurrenceRule: 'FREQ=DAILY',
                resourceId: resources[Math.floor(i / numberOfEventsPerResource)].value
            };

            events.push(event);
        }

        return events;
    }
})();

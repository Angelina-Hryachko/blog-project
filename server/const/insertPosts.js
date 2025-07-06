const Post = require('../models/Post.js')

function insertPostData() {
    Post.insertMany([
    {
        title: "Exploring Lunar Caves",
        body: "A comprehensive guide to navigating ancient lava tubes on the Moon's surface."
    },
    {
        title: "The Art of Pancake Origami",
        body: "Learn how to fold and shape pancakes into creative 3D edible sculptures."
    },
    {
        title: "Quantum Turtles and Time Travel",
        body: "A theoretical exploration of turtle-based propulsion in quantum timelines."
    },
    {
        title: "Building Cities with Marshmallows",
        body: "Discover structural design techniques using only marshmallows and spaghetti sticks."
    },
    {
        title: "Invisible Paint: How to See Nothing",
        body: "Understand the science and art behind creating transparent pigments."
    },
    {
        title: "Training Cactus to Dance",
        body: "A fun experiment in using soundwaves to influence plant behavior."
    },
    {
        title: "Underwater Wi-Fi Networks for Octopuses",
        body: "Explore the possibilities of marine communication infrastructure built for cephalopods."
    },
    {
        title: "How to Speak Fluent Dolphin",
        body: "Study click patterns and aquatic gestures in dolphin communication theory."
    },
    {
        title: "Teleporting Toast: A Breakfast Revolution",
        body: "Technology that sends freshly made toast across dimensions instantly."
    },
    {
        title: "Racing Clouds with Jet-Propelled Kites",
        body: "Learn about the physics and engineering behind supersonic kite sports."
    }
    ])
}

module.exports = insertPostData
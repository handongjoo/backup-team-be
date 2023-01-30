const express = require('express');
const router = express.Router()

router.get('/tags', (req, res) => {
    return res.send("상위 10개 태그 목록입니다.")
})

module.exports = router
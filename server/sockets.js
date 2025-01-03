function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on("getNodeStatus", function(pollId) {
    socket.emit("sendNodeStatus", data.getNodeStatus(pollId));
  });

  socket.on("nodeStatusUpdate", function (pollId, d) {
    const currentStatus = data.getNodeStatus(pollId)[d.node];
  
    // Prevent overwriting status 1 or 2
    if (currentStatus === 1 || currentStatus === 2 || currentStatus === 3) {
      console.log("Invalid update: Cannot change node status from", currentStatus, "to", d.status);
      return;
    }
  
    // Allow valid updates
    data.nodeStatusUpdate(pollId, d);
    io.to(pollId).emit("sendNodeStatus", data.getNodeStatus(pollId));

    /*Emil: om man ändrar raden ovan till:
    process.nextTick(() => {
    io.to(pollId).emit("sendNodeStatus", data.getNodeStatus(pollId));
    });
    Verkar man kunna ta bort användningen av getNodeStatus helt. Personligen tkr jag det blir mer cleant,
    blir mindre kommunikation mellan server och client.
     */

  });
  

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang)
    socket.emit('pollData', data.getPoll(d.pollId));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
  });

  socket.on('getNumberOfQuestions', function(pollId) {
    socket.emit('numberOfQuestions', data.getNumberOfQuestions(pollId).length);

  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId); // Add the client to the poll's room
    //socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
  });

  socket.on("participateInPoll", function (d) {
    const poll = data.getPoll(d.pollId);
  
    if (!poll.participants.some((p) => p.role === "Player 1")) {
      // Assign Player 1
      data.participateInPoll(d.pollId, { name: "Player 1", role: "Player 1" });
      socket.emit("playerRoleAssigned", "Player 1");
      socket.join(d.pollId);
    } else if (!poll.participants.some((p) => p.role === "Player 2")) {
      // Assign Player 2
      data.participateInPoll(d.pollId, { name: "Player 2", role: "Player 2" });
      socket.emit("playerRoleAssigned", "Player 2");
      socket.join(d.pollId);
    } else {
      // Reject additional players
      socket.emit("error", "The game already has two players.");
      return;
    }
  
    io.to(d.pollId).emit("participantsUpdate", data.getParticipants(d.pollId));
  
    // Start the game if both players have joined
    if (poll.participants.length === 2) {
      io.to(d.pollId).emit("startPoll");
    }
  });

  socket.on('runQuestion', function(d) {
    let question = data.getQuestion(d.pollId, d.playerRole, d.questionNumber);
    io.to(d.pollId).emit('questionUpdate', {q:question, playerRole:d.playerRole});
  
  });

  socket.on('submitAnswer', function(d) {
     
    data.submitAnswer(d);
    console.log("now executing emit")
    process.nextTick(() => {
      io.to(d.pollId).emit("sendNodeStatus", data.getNodeStatus(d.pollId));
      io.to(d.pollId).emit('submittedAnswersUpdate', data.getScores(d.pollId));
    });
  }); 

  socket.on('validatePollId', (pollId, callback) => {
    if (typeof pollId !== 'string' || pollId.trim() === '') {
      return callback(false);
    }
    const pollExists = data.pollExists(pollId);
    callback(pollExists);
  });


}

export { sockets };
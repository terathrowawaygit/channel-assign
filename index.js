module.exports = function PartyChannelDivider(mod) {
    let partyMembers = [];
    let channelsAmount = 20;
   
    // /8 assign
    mod.command.add('assign', (arg) => {
        if (partyMembers.length > 0) {
            let partyMemberSize = partyMembers.length;
            let channelSplitSize = Math.floor(channelsAmount / partyMemberSize) - 1;
            let currentChannel = 1
            let endChannel = 20
            let msg = ''

            for(let i = 0; i < partyMemberSize; i++) {
              endChannel = (i == partyMemberSize - 1) ? channelsAmount : (currentChannel + channelSplitSize);
              msg += partyMembers[i].name + ': ' + currentChannel + '-' + endChannel;
              msg = (i == partyMemberSize - 1) ? msg : msg + ', ';
              currentChannel = endChannel + 1;
            }

            mod.command.message(msg);

            // Sends msg to party chat (/p)
            mod.send('C_CHAT', 1, {
              channel: 1,
              message: msg
            });
        }
        else {
            mod.command.message("Must have at least 1 other member in your party")
        }
    });
   
    mod.game.on('enter_game', () => {
        partyMembers = [];
    });

    mod.hook('S_PARTY_MEMBER_LIST', 7, (event) => {
        partyMembers = event.members;
    })
    
    mod.hook('S_LEAVE_PARTY', 1, (event) => {
        partyMembers = [];
    });
    
    mod.hook('S_LEAVE_PARTY_MEMBER', 2, (event) => {
        partyMembers = partyMembers.filter(m => m.playerId != event.playerId);
    });

    mod.hook('S_BAN_PARTY_MEMBER', 1, (event) => {
        partyMembers = partyMembers.filter(m => m.playerId != event.playerId);
    });
}
